import { HandleException } from "./decorators/handle-exception.decorator";
import { findBestHandler } from "./functions";
import { ExceptionHandler } from "./interfaces/exception-handler.interface";
import { RouterResponse } from "./types";

describe("Functions", () => {
  describe("findBestHandler", () => {
    class GenericHandler implements ExceptionHandler {
      handle(err: Error): RouterResponse<any> | Promise<RouterResponse<any>> {
        return;
      }
    }
    class MethodSpecificException extends Error {}
    class MethodGenericException extends Error {}
    class ControllerSpecificException extends Error {}
    class ControllerGenericException extends Error {}

    @HandleException(MethodSpecificException)
    class MethodSpecificHandler extends GenericHandler {}

    @HandleException()
    class MethodGenericHandler extends GenericHandler {}

    @HandleException(ControllerSpecificException)
    class ControllerSpecificHandler extends GenericHandler {}

    @HandleException()
    class ControllerGenericHandler extends GenericHandler {}

    it("will return the first specific token at the method level", () => {
      expect(
        findBestHandler(
          new MethodSpecificException(),
          [MethodGenericHandler, MethodSpecificHandler],
          [ControllerGenericHandler, ControllerSpecificHandler],
        ),
      ).toEqual(MethodSpecificHandler);
    });

    it("will return the first generic token at the method level if no matching specific tokens", () => {
      expect(
        findBestHandler(
          new MethodGenericException(),
          [MethodGenericHandler, MethodSpecificHandler],
          [ControllerGenericHandler, ControllerSpecificHandler],
        ),
      ).toEqual(MethodGenericHandler);
    });

    it("will return the first specific controller token if no method tokens", () => {
      expect(
        findBestHandler(
          new ControllerSpecificException(),
          [],
          [ControllerGenericHandler, ControllerSpecificHandler],
        ),
      ).toEqual(ControllerSpecificHandler);
    });

    it("will return the first generic token at the controller level if no matching specific tokens", () => {
      expect(
        findBestHandler(
          new ControllerGenericException(),
          [],
          [ControllerGenericHandler, ControllerSpecificHandler],
        ),
      ).toEqual(ControllerGenericHandler);
    });

    it("will return undefined if no handlers are found", () => {
      expect(
        findBestHandler(new MethodGenericException(), [], []),
      ).toBeUndefined();
    });
  });
});
